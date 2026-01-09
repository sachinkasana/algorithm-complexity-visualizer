'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Zap, BarChart3, TrendingUp, BookOpen, Edit3 } from 'lucide-react';

const AlgorithmComplexityVisualizer = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(500);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('bubbleSort');
  const [mode, setMode] = useState('single'); // 'single' or 'compare'
  const [compareAlgorithm, setCompareAlgorithm] = useState('selectionSort');
  
  // Single mode state
  const [array, setArray] = useState([]);
  const [comparing, setComparing] = useState([]);
  const [swapping, setSwapping] = useState([]);
  const [sorted, setSorted] = useState([]);
  const [operations, setOperations] = useState(0);
  const [logs, setLogs] = useState([]);
  const [highlightedLine, setHighlightedLine] = useState(null);
  const [explanation, setExplanation] = useState('Click Start to begin visualization');
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  
  // Compare mode state
  const [array1, setArray1] = useState([]);
  const [comparing1, setComparing1] = useState([]);
  const [swapping1, setSwapping1] = useState([]);
  const [sorted1, setSorted1] = useState([]);
  const [operations1, setOperations1] = useState(0);
  const [step1, setStep1] = useState(0);
  const [finished1, setFinished1] = useState(false);
  
  const [array2, setArray2] = useState([]);
  const [comparing2, setComparing2] = useState([]);
  const [swapping2, setSwapping2] = useState([]);
  const [sorted2, setSorted2] = useState([]);
  const [operations2, setOperations2] = useState(0);
  const [step2, setStep2] = useState(0);
  const [finished2, setFinished2] = useState(false);
  const [time1, setTime1] = useState(0);
  const [time2, setTime2] = useState(0);
  const [arraySize, setArraySize] = useState(8);
  const [customArrayInput, setCustomArrayInput] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  
  const animationRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const algorithms = {
    bubbleSort: {
      name: 'Bubble Sort',
      complexity: { time: 'O(n²)', space: 'O(1)' },
      description: 'Repeatedly swaps adjacent elements if they are in wrong order',
      code: `function bubbleSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        swap(arr, j, j + 1);
      }
    }
  }
  return arr;
}`,
      generate: (arr) => {
        const steps = [];
        const len = arr.length;
        
        for (let i = 0; i < len; i++) {
          for (let j = 0; j < len - i - 1; j++) {
            steps.push({
              type: 'compare',
              indices: [j, j + 1],
              line: 3,
              explanation: `Comparing ${arr[j]} and ${arr[j + 1]}`
            });
            
            if (arr[j] > arr[j + 1]) {
              steps.push({
                type: 'swap',
                indices: [j, j + 1],
                line: 4,
                explanation: `Swapping ${arr[j]} and ${arr[j + 1]}`
              });
              [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            }
          }
          
          steps.push({
            type: 'sorted',
            index: len - i - 1,
            line: 2,
            explanation: `Element ${arr[len - i - 1]} is now in correct position`
          });
        }
        
        return steps;
      }
    },
    selectionSort: {
      name: 'Selection Sort',
      complexity: { time: 'O(n²)', space: 'O(1)' },
      description: 'Selects minimum element and places it at beginning',
      code: `function selectionSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    let minIndex = i;
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }
    swap(arr, i, minIndex);
  }
  return arr;
}`,
      generate: (arr) => {
        const steps = [];
        const len = arr.length;
        
        for (let i = 0; i < len; i++) {
          let minIndex = i;
          
          steps.push({
            type: 'compare',
            indices: [i],
            line: 2,
            explanation: `Finding minimum element from index ${i}`
          });
          
          for (let j = i + 1; j < len; j++) {
            steps.push({
              type: 'compare',
              indices: [minIndex, j],
              line: 4,
              explanation: `Comparing ${arr[minIndex]} with ${arr[j]}`
            });
            
            if (arr[j] < arr[minIndex]) {
              minIndex = j;
              steps.push({
                type: 'compare',
                indices: [minIndex],
                line: 5,
                explanation: `New minimum: ${arr[minIndex]} at index ${minIndex}`
              });
            }
          }
          
          if (minIndex !== i) {
            steps.push({
              type: 'swap',
              indices: [i, minIndex],
              line: 8,
              explanation: `Swapping ${arr[i]} with minimum ${arr[minIndex]}`
            });
            [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
          }
          
          steps.push({
            type: 'sorted',
            index: i,
            line: 2,
            explanation: `Position ${i} is sorted with value ${arr[i]}`
          });
        }
        
        return steps;
      }
    },
    insertionSort: {
      name: 'Insertion Sort',
      complexity: { time: 'O(n²)', space: 'O(1)' },
      description: 'Builds sorted array one element at a time',
      code: `function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    let key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
  return arr;
}`,
      generate: (arr) => {
        const steps = [];
        const len = arr.length;
        
        steps.push({
          type: 'sorted',
          index: 0,
          line: 1,
          explanation: `First element ${arr[0]} is trivially sorted`
        });
        
        for (let i = 1; i < len; i++) {
          const key = arr[i];
          let j = i - 1;
          
          steps.push({
            type: 'compare',
            indices: [i],
            line: 3,
            explanation: `Picking element ${key} to insert into sorted portion`
          });
          
          while (j >= 0 && arr[j] > key) {
            steps.push({
              type: 'compare',
              indices: [j, j + 1],
              line: 5,
              explanation: `Shifting ${arr[j]} right (${arr[j]} > ${key})`
            });
            
            arr[j + 1] = arr[j];
            j--;
          }
          
          arr[j + 1] = key;
          
          steps.push({
            type: 'swap',
            indices: [j + 1],
            line: 8,
            explanation: `Inserting ${key} at position ${j + 1}`
          });
          
          for (let k = 0; k <= i; k++) {
            steps.push({
              type: 'sorted',
              index: k,
              line: 2,
              explanation: `First ${i + 1} elements are now sorted`
            });
          }
        }
        
        return steps;
      }
    },
    linearSearch: {
      name: 'Linear Search',
      complexity: { time: 'O(n)', space: 'O(1)' },
      description: 'Searches for element by checking each position',
      code: `function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      return i; // Found!
    }
  }
  return -1; // Not found
}`,
      generate: (arr) => {
        const steps = [];
        const target = arr[Math.floor(arr.length / 2)]; // Search for middle element
        
        steps.push({
          type: 'compare',
          indices: [],
          line: 1,
          explanation: `Searching for ${target} in the array`
        });
        
        for (let i = 0; i < arr.length; i++) {
          steps.push({
            type: 'compare',
            indices: [i],
            line: 2,
            explanation: `Checking if arr[${i}] (${arr[i]}) equals ${target}`
          });
          
          if (arr[i] === target) {
            steps.push({
              type: 'sorted',
              index: i,
              line: 3,
              explanation: `Found ${target} at index ${i}! ✅`
            });
            break;
          }
        }
        
        return steps;
      }
    },
    binarySearch: {
      name: 'Binary Search',
      complexity: { time: 'O(log n)', space: 'O(1)' },
      description: 'Efficiently searches sorted array by halving search space',
      code: `function binarySearch(arr, target) {
  let left = 0, right = arr.length - 1;
  
  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}`,
      generate: (arr) => {
        const steps = [];
        const sortedArr = [...arr].sort((a, b) => a - b);
        const target = sortedArr[Math.floor(sortedArr.length / 2)];
        
        let left = 0;
        let right = sortedArr.length - 1;
        
        steps.push({
          type: 'compare',
          indices: [],
          line: 1,
          explanation: `Binary search for ${target} in sorted array`
        });
        
        while (left <= right) {
          const mid = Math.floor((left + right) / 2);
          
          steps.push({
            type: 'compare',
            indices: [left, mid, right],
            line: 5,
            explanation: `Checking middle element: arr[${mid}] = ${sortedArr[mid]}`
          });
          
          if (sortedArr[mid] === target) {
            steps.push({
              type: 'sorted',
              index: mid,
              line: 7,
              explanation: `Found ${target} at index ${mid}! ✅`
            });
            break;
          }
          
          if (sortedArr[mid] < target) {
            steps.push({
              type: 'compare',
              indices: [mid, right],
              line: 8,
              explanation: `${sortedArr[mid]} < ${target}, search right half`
            });
            left = mid + 1;
          } else {
            steps.push({
              type: 'compare',
              indices: [left, mid],
              line: 9,
              explanation: `${sortedArr[mid]} > ${target}, search left half`
            });
            right = mid - 1;
          }
        }
        
        return steps;
      }
    },
    quickSort: {
      name: 'Quick Sort',
      complexity: { time: 'O(n log n)', space: 'O(log n)' },
      description: 'Divide-and-conquer using pivot partitioning',
      code: `function quickSort(arr, low, high) {
  if (low < high) {
    let pivot = partition(arr, low, high);
    quickSort(arr, low, pivot - 1);
    quickSort(arr, pivot + 1, high);
  }
}

function partition(arr, low, high) {
  let pivot = arr[high];
  let i = low - 1;
  for (let j = low; j < high; j++) {
    if (arr[j] < pivot) {
      i++;
      swap(arr, i, j);
    }
  }
  swap(arr, i + 1, high);
  return i + 1;
}`,
      generate: (arr) => {
        const steps = [];
        
        const partition = (arr, low, high, depth = 0) => {
          const pivot = arr[high];
          steps.push({
            type: 'compare',
            indices: [high],
            line: 10,
            explanation: `Pivot: ${pivot} at index ${high}`
          });
          
          let i = low - 1;
          
          for (let j = low; j < high; j++) {
            steps.push({
              type: 'compare',
              indices: [j, high],
              line: 13,
              explanation: `Comparing ${arr[j]} with pivot ${pivot}`
            });
            
            if (arr[j] < pivot) {
              i++;
              if (i !== j) {
                steps.push({
                  type: 'swap',
                  indices: [i, j],
                  line: 15,
                  explanation: `Swapping ${arr[i]} and ${arr[j]}`
                });
                [arr[i], arr[j]] = [arr[j], arr[i]];
              }
            }
          }
          
          steps.push({
            type: 'swap',
            indices: [i + 1, high],
            line: 18,
            explanation: `Moving pivot ${pivot} to position ${i + 1}`
          });
          [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
          
          steps.push({
            type: 'sorted',
            index: i + 1,
            line: 19,
            explanation: `Pivot ${arr[i + 1]} is now in correct position`
          });
          
          return i + 1;
        };
        
        const quickSortHelper = (arr, low, high) => {
          if (low < high) {
            const pivotIndex = partition(arr, low, high);
            quickSortHelper(arr, low, pivotIndex - 1);
            quickSortHelper(arr, pivotIndex + 1, high);
          } else if (low === high) {
            steps.push({
              type: 'sorted',
              index: low,
              line: 2,
              explanation: `Single element ${arr[low]} is sorted`
            });
          }
        };
        
        quickSortHelper(arr, 0, arr.length - 1);
        
        return steps;
      }
    },
    mergeSort: {
      name: 'Merge Sort',
      complexity: { time: 'O(n log n)', space: 'O(n)' },
      description: 'Divide-and-conquer with merge operation',
      code: `function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  
  return merge(left, right);
}

function merge(left, right) {
  let result = [], i = 0, j = 0;
  
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }
  
  return result.concat(left.slice(i)).concat(right.slice(j));
}`,
      generate: (arr) => {
        const steps = [];
        const tempArr = [...arr];
        
        const merge = (arr, start, mid, end) => {
          const left = arr.slice(start, mid + 1);
          const right = arr.slice(mid + 1, end + 1);
          
          steps.push({
            type: 'compare',
            indices: Array.from({length: end - start + 1}, (_, i) => start + i),
            line: 11,
            explanation: `Merging subarrays [${start}..${mid}] and [${mid + 1}..${end}]`
          });
          
          let i = 0, j = 0, k = start;
          
          while (i < left.length && j < right.length) {
            steps.push({
              type: 'compare',
              indices: [start + i, mid + 1 + j],
              line: 14,
              explanation: `Comparing ${left[i]} and ${right[j]}`
            });
            
            if (left[i] <= right[j]) {
              arr[k] = left[i];
              steps.push({
                type: 'swap',
                indices: [k],
                line: 15,
                explanation: `Placing ${left[i]} at position ${k}`
              });
              i++;
            } else {
              arr[k] = right[j];
              steps.push({
                type: 'swap',
                indices: [k],
                line: 17,
                explanation: `Placing ${right[j]} at position ${k}`
              });
              j++;
            }
            k++;
          }
          
          while (i < left.length) {
            arr[k] = left[i];
            steps.push({
              type: 'swap',
              indices: [k],
              line: 21,
              explanation: `Placing remaining ${left[i]} at position ${k}`
            });
            i++;
            k++;
          }
          
          while (j < right.length) {
            arr[k] = right[j];
            steps.push({
              type: 'swap',
              indices: [k],
              line: 21,
              explanation: `Placing remaining ${right[j]} at position ${k}`
            });
            j++;
            k++;
          }
          
          for (let idx = start; idx <= end; idx++) {
            steps.push({
              type: 'sorted',
              index: idx,
              line: 8,
              explanation: `Subarray [${start}..${end}] is now sorted`
            });
          }
        };
        
        const mergeSortHelper = (arr, start, end) => {
          if (start < end) {
            const mid = Math.floor((start + end) / 2);
            
            steps.push({
              type: 'compare',
              indices: [start, mid, end],
              line: 4,
              explanation: `Dividing array: [${start}..${mid}] and [${mid + 1}..${end}]`
            });
            
            mergeSortHelper(arr, start, mid);
            mergeSortHelper(arr, mid + 1, end);
            merge(arr, start, mid, end);
          }
        };
        
        mergeSortHelper(tempArr, 0, tempArr.length - 1);
        
        // Copy sorted array back
        for (let i = 0; i < tempArr.length; i++) {
          arr[i] = tempArr[i];
        }
        
        return steps;
      }
    }
  };

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      @keyframes slideDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
      @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
      .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
      .animate-slideDown { animation: slideDown 0.5s ease-out; }
      .animate-slideUp { animation: slideUp 0.5s ease-out; }
      .animate-bounce { animation: bounce 0.6s ease-in-out; }
      .animate-pulse { animation: pulse 1s ease-in-out infinite; }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    initializeArray();
  }, [selectedAlgorithm, compareAlgorithm, mode]);

  const initializeArray = () => {
    const size = (mode === 'single' ? selectedAlgorithm : compareAlgorithm).includes('Search') ? Math.min(arraySize + 4, 16) : arraySize;
    const newArray = Array.from({ length: size }, () => Math.floor(Math.random() * 90) + 10);
    
    if (mode === 'single') {
      setArray(newArray);
      setComparing([]);
      setSwapping([]);
      setSorted([]);
      setOperations(0);
      setLogs([]);
      setCurrentStep(0);
      setHighlightedLine(null);
      setExplanation('Click Start to begin visualization');
      setStartTime(null);
      setElapsedTime(0);
    } else {
      // Initialize both algorithms with SAME array for fair comparison
      setArray1([...newArray]);
      setArray2([...newArray]);
      setComparing1([]);
      setSwapping1([]);
      setSorted1([]);
      setOperations1(0);
      setStep1(0);
      setFinished1(false);
      setTime1(0);
      setComparing2([]);
      setSwapping2([]);
      setSorted2([]);
      setOperations2(0);
      setStep2(0);
      setFinished2(false);
      setTime2(0);
    }
  };

  const applyCustomArray = () => {
    try {
      const values = customArrayInput
        .split(',')
        .map(v => parseInt(v.trim()))
        .filter(v => !isNaN(v) && v >= 1 && v <= 99);
      
      if (values.length < 3) {
        alert('Please enter at least 3 numbers between 1-99, separated by commas');
        return;
      }
      
      if (values.length > 20) {
        alert('Maximum 20 numbers allowed');
        return;
      }
      
      if (mode === 'single') {
        setArray(values);
        setComparing([]);
        setSwapping([]);
        setSorted([]);
        setOperations(0);
        setLogs([]);
        setCurrentStep(0);
        setHighlightedLine(null);
        setExplanation('Custom array loaded! Click Start to visualize.');
        setStartTime(null);
        setElapsedTime(0);
      } else {
        setArray1([...values]);
        setArray2([...values]);
        setComparing1([]);
        setSwapping1([]);
        setSorted1([]);
        setOperations1(0);
        setStep1(0);
        setFinished1(false);
        setTime1(0);
        setComparing2([]);
        setSwapping2([]);
        setSorted2([]);
        setOperations2(0);
        setStep2(0);
        setFinished2(false);
        setTime2(0);
      }
      
      setShowCustomInput(false);
      setCustomArrayInput('');
    } catch (error) {
      alert('Invalid input. Please use format: 45, 23, 67, 12');
    }
  };

  const executeStep = (step, currentArray) => {
    setOperations(prev => prev + 1);
    setHighlightedLine(step.line);
    setExplanation(step.explanation);
    
    setLogs(prev => [...prev, `Step ${currentStep + 1}: ${step.explanation}`].slice(-5));
    
    switch (step.type) {
      case 'compare':
        setComparing(step.indices);
        setSwapping([]);
        break;
      case 'swap':
        setSwapping(step.indices);
        setComparing([]);
        break;
      case 'sorted':
        setSorted(prev => [...new Set([...prev, step.index])]);
        setComparing([]);
        setSwapping([]);
        break;
    }
  };

  useEffect(() => {
    if (isRunning) {
      if (mode === 'single') {
        // Single algorithm mode
        const tempArray = [...array];
        const steps = algorithms[selectedAlgorithm].generate(tempArray);
        
        if (currentStep < steps.length) {
          animationRef.current = setTimeout(() => {
            executeStep(steps[currentStep], tempArray);
            setCurrentStep(prev => prev + 1);
            
            if (currentStep === 0) {
              setArray(tempArray);
            }
          }, speed);
        } else {
          setIsRunning(false);
          setComparing([]);
          setSwapping([]);
          setExplanation('Algorithm complete! All elements processed.');
        }
      } else {
        // Compare mode - run both simultaneously
        const tempArray1 = [...array1];
        const tempArray2 = [...array2];
        const steps1 = algorithms[selectedAlgorithm].generate(tempArray1);
        const steps2 = algorithms[compareAlgorithm].generate(tempArray2);
        
        animationRef.current = setTimeout(() => {
          // Execute step for algorithm 1
          if (step1 < steps1.length && !finished1) {
            const s = steps1[step1];
            setOperations1(prev => prev + 1);
            
            switch (s.type) {
              case 'compare':
                setComparing1(s.indices);
                setSwapping1([]);
                break;
              case 'swap':
                setSwapping1(s.indices);
                setComparing1([]);
                break;
              case 'sorted':
                setSorted1(prev => [...new Set([...prev, s.index])]);
                setComparing1([]);
                setSwapping1([]);
                break;
            }
            
            setStep1(prev => prev + 1);
            if (step1 === 0) setArray1(tempArray1);
          } else if (!finished1) {
            setFinished1(true);
            setComparing1([]);
            setSwapping1([]);
          }
          
          // Execute step for algorithm 2
          if (step2 < steps2.length && !finished2) {
            const s = steps2[step2];
            setOperations2(prev => prev + 1);
            
            switch (s.type) {
              case 'compare':
                setComparing2(s.indices);
                setSwapping2([]);
                break;
              case 'swap':
                setSwapping2(s.indices);
                setComparing2([]);
                break;
              case 'sorted':
                setSorted2(prev => [...new Set([...prev, s.index])]);
                setComparing2([]);
                setSwapping2([]);
                break;
            }
            
            setStep2(prev => prev + 1);
            if (step2 === 0) setArray2(tempArray2);
          } else if (!finished2) {
            setFinished2(true);
            setComparing2([]);
            setSwapping2([]);
          }
          
          // Stop when both are finished
          if (finished1 && finished2) {
            setIsRunning(false);
          }
        }, speed);
      }
    }
    
    return () => clearTimeout(animationRef.current);
  }, [isRunning, currentStep, step1, step2, finished1, finished2, speed, mode]);

  const start = () => {
    if (currentStep === 0) {
      const tempArray = [...array];
      const steps = algorithms[selectedAlgorithm].generate(tempArray);
      setArray(tempArray);
      setStartTime(Date.now());
    }
    setIsRunning(true);
  };

  const reset = () => {
    setIsRunning(false);
    initializeArray();
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  // Timer for elapsed time in single mode
  useEffect(() => {
    if (isRunning && mode === 'single' && startTime) {
      timerRef.current = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 10);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning, mode, startTime]);

  // Timer for compare mode
  useEffect(() => {
    if (isRunning && mode === 'compare') {
      timerRef.current = setInterval(() => {
        if (!finished1) setTime1(prev => prev + 10);
        if (!finished2) setTime2(prev => prev + 10);
      }, 10);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning, mode, finished1, finished2]);

  const renderCodeWithHighlight = (code) => {
    return code.split('\n').map((line, idx) => {
      const lineNum = idx + 1;
      const isHighlighted = highlightedLine === lineNum;
      return (
        <div
          key={idx}
          className={`flex transition-all duration-300 ${
            isHighlighted ? 'bg-cyan-500/30 border-l-4 border-cyan-400 scale-[1.02]' : ''
          }`}
        >
          <span className={`inline-block w-8 text-right pr-3 select-none ${
            isHighlighted ? 'text-cyan-300 font-bold' : 'text-gray-500'
          }`}>
            {lineNum}
          </span>
          <span className={isHighlighted ? 'text-white font-semibold' : 'text-emerald-400'}>
            {line || ' '}
          </span>
        </div>
      );
    });
  };

  const maxValue = Math.max(1, ...(mode === 'single' ? array : [...array1, ...array2]));

  const renderArrayVisualization = (arr, comp, swap, sort, algorithmName, ops, isFinished, time) => (
    <div className="bg-gradient-to-br from-white/10 to-cyan-500/10 backdrop-blur-xl rounded-2xl p-4 border border-cyan-400/30 shadow-xl shadow-cyan-500/10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-white">
          {algorithmName}
        </h2>
        <div className="flex items-center gap-4">
          <div className="text-xs">
            <span className="text-cyan-300 font-semibold">Ops:</span> <span className="text-white font-bold">{ops}</span>
          </div>
          <div className="text-xs">
            <span className="text-blue-300 font-semibold">Time:</span> <span className="text-white font-bold">{(time / 1000).toFixed(2)}s</span>
          </div>
          {isFinished && (
            <div className="bg-emerald-500/20 border border-emerald-400 text-emerald-300 px-3 py-1 rounded-full text-xs font-bold animate-pulse">
              ✓ Done!
            </div>
          )}
        </div>
      </div>
      <div className="flex items-end justify-center gap-1 h-[200px]">
        {arr.map((value, idx) => {
          const isComparing = comp.includes(idx);
          const isSwapping = swap.includes(idx);
          const isSorted = sort.includes(idx);
          
          let colorClass = 'from-cyan-500 to-blue-500';
          if (isSorted) colorClass = 'from-emerald-500 to-teal-500';
          else if (isSwapping) colorClass = 'from-red-500 to-orange-500';
          else if (isComparing) colorClass = 'from-yellow-500 to-amber-500';
          
          return (
            <div key={idx} className="flex flex-col items-center gap-2 flex-1 min-w-0">
              <div
                className={`w-full bg-gradient-to-t ${colorClass} rounded-t-lg transition-all duration-300 shadow-lg ${
                  isSwapping ? 'animate-bounce' : ''
                } ${isComparing ? 'animate-pulse' : ''}`}
                style={{ height: `${(value / maxValue) * 100}%`, minHeight: '20px' }}
              ></div>
              <span className="text-white text-[10px] font-bold">{value}</span>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-3">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="text-center mb-2">
          <div className="inline-flex items-center justify-center gap-3 animate-fadeIn">
            <div className="relative">
              <BarChart3 className="text-cyan-400 animate-pulse" size={26} />
              <div className="absolute inset-0 bg-cyan-400/20 blur-xl animate-pulse"></div>
            </div>
            <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-white animate-slideDown">
              Algorithm Complexity Visualizer
            </h1>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-gradient-to-br from-white/10 to-cyan-500/10 backdrop-blur-xl rounded-2xl p-3 mb-3 border border-cyan-400/30 shadow-2xl shadow-cyan-500/20">
          {/* Mode Toggle */}
          <div className="flex gap-2 mb-3 border-b border-cyan-400/20 pb-3">
            <button
              onClick={() => {
                setMode('single');
                setIsRunning(false);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 text-sm font-medium ${
                mode === 'single' 
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/50 scale-105' 
                  : 'bg-white/5 text-cyan-200 hover:bg-white/10 hover:scale-105'
              }`}
            >
              <BookOpen size={18} />
              Single Algorithm
            </button>
            <button
              onClick={() => {
                setMode('compare');
                setIsRunning(false);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 text-sm font-medium ${
                mode === 'compare' 
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/50 scale-105' 
                  : 'bg-white/5 text-cyan-200 hover:bg-white/10 hover:scale-105'
              }`}
            >
              <BarChart3 size={18} />
              Compare Algorithms
            </button>
          </div>

          <div className="flex flex-wrap gap-3 items-center justify-between mb-3">
            <div className="flex gap-2">
              <button
                onClick={isRunning ? () => setIsRunning(false) : start}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-6 py-2.5 rounded-xl flex items-center gap-2 transition-all duration-300 font-semibold shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-105"
              >
                {isRunning ? <Pause size={18} /> : <Play size={18} />}
                {isRunning ? 'Pause' : 'Start'}
              </button>
              <button
                onClick={reset}
                className="bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all duration-300 border border-white/20 hover:border-cyan-400/50 hover:scale-105"
              >
                <RotateCcw size={18} />
                Reset
              </button>
              <button
                onClick={() => setShowCustomInput(!showCustomInput)}
                className="bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all duration-300 border border-white/20 hover:border-cyan-400/50 hover:scale-105"
              >
                <Edit3 size={18} />
                Custom Array
              </button>
            </div>

            {mode === 'single' ? (
              <div className="flex items-center gap-3">
                <label className="text-cyan-100 text-sm font-medium">Algorithm:</label>
                <select
                  value={selectedAlgorithm}
                  onChange={(e) => {
                    setSelectedAlgorithm(e.target.value);
                    setIsRunning(false);
                  }}
                  className="bg-white/10 text-white px-4 py-2.5 rounded-xl border border-cyan-400/30 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 text-sm font-medium"
                >
                  {Object.entries(algorithms).map(([key, algo]) => (
                    <option key={key} value={key} className="bg-slate-800">
                      {algo.name}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <label className="text-cyan-100 text-sm font-medium">Algorithm 1:</label>
                  <select
                    value={selectedAlgorithm}
                    onChange={(e) => {
                      setSelectedAlgorithm(e.target.value);
                      setIsRunning(false);
                    }}
                    className="bg-white/10 text-white px-3 py-2 rounded-xl border border-cyan-400/30 focus:outline-none text-sm font-medium"
                  >
                    {Object.entries(algorithms).map(([key, algo]) => (
                      <option key={key} value={key} className="bg-slate-800">
                        {algo.name}
                      </option>
                    ))}
                  </select>
                </div>
                <span className="text-cyan-300 font-bold">VS</span>
                <div className="flex items-center gap-2">
                  <label className="text-cyan-100 text-sm font-medium">Algorithm 2:</label>
                  <select
                    value={compareAlgorithm}
                    onChange={(e) => {
                      setCompareAlgorithm(e.target.value);
                      setIsRunning(false);
                    }}
                    className="bg-white/10 text-white px-3 py-2 rounded-xl border border-cyan-400/30 focus:outline-none text-sm font-medium"
                  >
                    {Object.entries(algorithms).map(([key, algo]) => (
                      <option key={key} value={key} className="bg-slate-800">
                        {algo.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <label className="text-cyan-100 text-sm font-medium">Speed:</label>
              <input
                type="range"
                min="100"
                max="1000"
                step="100"
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="w-24 accent-cyan-400"
              />
              <span className="text-cyan-100 text-sm w-16 font-medium">{speed}ms</span>
            </div>

            {mode === 'single' && (
              <div className="flex items-center gap-3">
                <label className="text-cyan-100 text-sm font-medium">Array Size:</label>
                <input
                  type="range"
                  min="5"
                  max="15"
                  step="1"
                  value={arraySize}
                  onChange={(e) => {
                    setArraySize(Number(e.target.value));
                    if (!isRunning) initializeArray();
                  }}
                  className="w-24 accent-cyan-400"
                />
                <span className="text-cyan-100 text-sm w-8 font-medium">{arraySize}</span>
              </div>
            )}
          </div>

          {/* Custom Array Input */}
          {showCustomInput && (
            <div className="mb-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-2 border-cyan-400/50 rounded-xl p-3 animate-slideDown">
              <h3 className="text-cyan-300 font-bold mb-2 text-sm">Enter Custom Array</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customArrayInput}
                  inputMode="numeric"
                  pattern="[0-9,\\s]*"
                  onChange={(e) => {
                    const cleaned = e.target.value.replace(/[^0-9,\\s]/g, '');
                    setCustomArrayInput(cleaned);
                  }}
                  onBlur={() => {
                    const numbers = customArrayInput.match(/\d+/g) || [];
                    setCustomArrayInput(numbers.join(', '));
                  }}
                  placeholder="e.g., 45, 23, 67, 12, 89, 34"
                  className="flex-1 bg-black/30 text-white px-3 py-2 rounded-lg border border-cyan-400/30 focus:outline-none focus:border-cyan-400 placeholder-cyan-300/50"
                />
                <button
                  onClick={applyCustomArray}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-5 py-2 rounded-lg font-semibold hover:scale-105 transition-transform"
                >
                  Apply
                </button>
              </div>
              <p className="text-cyan-200 text-xs mt-2">
                💡 Enter 3-20 numbers (1-99) separated by commas
              </p>
            </div>
          )}

          {/* Info Bar */}
          {mode === 'single' ? (
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/50 rounded-xl p-3 hover:scale-105 transition-transform duration-300">
                <div className="text-cyan-300 text-xs font-medium mb-1">Time Complexity</div>
                <div className="text-white text-base font-bold">{algorithms[selectedAlgorithm].complexity.time}</div>
              </div>
              <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-400/50 rounded-xl p-3 hover:scale-105 transition-transform duration-300">
                <div className="text-blue-300 text-xs font-medium mb-1">Operations</div>
                <div className="text-white text-base font-bold">{operations}</div>
              </div>
              <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-400/50 rounded-xl p-3 hover:scale-105 transition-transform duration-300">
                <div className="text-emerald-300 text-xs font-medium mb-1">Time Elapsed</div>
                <div className="text-white text-base font-bold">{(elapsedTime / 1000).toFixed(2)}s</div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-2 border-cyan-400/50 rounded-xl p-3 hover:scale-105 transition-transform duration-300">
                <div className="text-cyan-300 text-sm font-bold mb-2">{algorithms[selectedAlgorithm].name}</div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-cyan-200">Time:</span>
                    <span className="text-white font-bold">{algorithms[selectedAlgorithm].complexity.time}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-cyan-200">Operations:</span>
                    <span className="text-white font-bold">{operations1}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-cyan-200">Duration:</span>
                    <span className="text-white font-bold">{(time1 / 1000).toFixed(2)}s</span>
                  </div>
                  {finished1 && !finished2 && <div className="text-emerald-400 text-xs font-bold animate-pulse">🏆 Winner!</div>}
                </div>
              </div>
              <div className="bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border-2 border-blue-400/50 rounded-xl p-3 hover:scale-105 transition-transform duration-300">
                <div className="text-blue-300 text-sm font-bold mb-2">{algorithms[compareAlgorithm].name}</div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-blue-200">Time:</span>
                    <span className="text-white font-bold">{algorithms[compareAlgorithm].complexity.time}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-blue-200">Operations:</span>
                    <span className="text-white font-bold">{operations2}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-blue-200">Duration:</span>
                    <span className="text-white font-bold">{(time2 / 1000).toFixed(2)}s</span>
                  </div>
                  {finished2 && !finished1 && <div className="text-emerald-400 text-xs font-bold animate-pulse">🏆 Winner!</div>}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        {mode === 'single' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {/* Left: Visualization */}
            <div className="space-y-4">
              {/* Array Visualization */}
              <div className="bg-gradient-to-br from-white/10 to-purple-500/10 backdrop-blur-xl rounded-2xl p-4 border border-purple-400/30 shadow-xl min-h-[320px]">
                <h2 className="text-base font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-white mb-3">
                  Array Visualization
                </h2>
                <div className="flex items-end justify-center gap-2 h-[220px]">
                  {array.map((value, idx) => {
                    const isComparing = comparing.includes(idx);
                    const isSwapping = swapping.includes(idx);
                    const isSorted = sorted.includes(idx);
                    
                    let colorClass = 'from-purple-500 to-pink-500';
                    if (isSorted) colorClass = 'from-emerald-500 to-teal-500';
                    else if (isSwapping) colorClass = 'from-red-500 to-orange-500';
                    else if (isComparing) colorClass = 'from-yellow-500 to-amber-500';
                    
                    return (
                      <div key={idx} className="flex flex-col items-center gap-1 flex-1">
                        <div
                          className={`w-full bg-gradient-to-t ${colorClass} rounded-t-lg transition-all duration-300 shadow-lg ${
                            isSwapping ? 'animate-bounce' : ''
                          } ${isComparing ? 'animate-pulse' : ''}`}
                          style={{ height: `${(value / maxValue) * 100}%` }}
                        ></div>
                        <span className="text-white text-xs font-bold">{value}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Explanation */}
              <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-2 border-purple-400/50 rounded-xl p-3 backdrop-blur-sm">
                <h3 className="text-sm font-bold text-purple-300 mb-2 flex items-center gap-2">
                  <Zap size={16} />
                  Current Step
                </h3>
                <p className="text-white text-sm">{explanation}</p>
              </div>

              {/* Logs */}
              <div className="bg-black/70 backdrop-blur-xl rounded-xl p-3 border border-purple-400/30">
                <h3 className="text-sm font-bold text-purple-300 mb-2">Recent Operations</h3>
                <div className="space-y-1 text-xs font-mono max-h-[70px] overflow-y-auto">
                  {logs.length === 0 ? (
                    <div className="text-purple-400/50">No operations yet...</div>
                  ) : (
                    logs.map((log, idx) => (
                      <div key={idx} className="text-purple-300 animate-slideUp">
                        {log}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Right: Code */}
            <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-2xl p-4 border-2 border-purple-400/30 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-white">
                  {algorithms[selectedAlgorithm].name}
                </h2>
                <span className="text-xs text-purple-300 bg-purple-500/20 px-3 py-1.5 rounded-full border border-purple-400/30">
                  {algorithms[selectedAlgorithm].description}
                </span>
              </div>
              <div className="bg-black/50 p-3 rounded-xl overflow-auto max-h-[360px] border border-purple-500/20">
                <pre className="text-sm font-mono">
                  <code>{renderCodeWithHighlight(algorithms[selectedAlgorithm].code)}</code>
                </pre>
              </div>
            </div>
          </div>
        ) : (
          /* Compare Mode */
          <div className="space-y-3">
            {/* Side by Side Comparison */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {renderArrayVisualization(array1, comparing1, swapping1, sorted1, algorithms[selectedAlgorithm].name, operations1, finished1, time1)}
              {renderArrayVisualization(array2, comparing2, swapping2, sorted2, algorithms[compareAlgorithm].name, operations2, finished2, time2)}
            </div>

            {/* Comparison Stats */}
            <div className="bg-gradient-to-br from-white/10 to-cyan-500/10 backdrop-blur-xl rounded-2xl p-4 border border-cyan-400/30 shadow-xl shadow-cyan-500/10">
              <h2 className="text-base font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-white mb-3">
                Performance Comparison
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-cyan-500/10 border border-cyan-400/30 rounded-xl p-3">
                  <div className="text-cyan-300 text-sm font-medium mb-2">Operation Count</div>
                  <div className="flex items-center justify-between">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{operations1}</div>
                      <div className="text-xs text-cyan-300">{algorithms[selectedAlgorithm].name}</div>
                    </div>
                    <div className="text-cyan-400 font-bold">VS</div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{operations2}</div>
                      <div className="text-xs text-cyan-300">{algorithms[compareAlgorithm].name}</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-emerald-500/10 border border-emerald-400/30 rounded-xl p-3 hover:scale-105 transition-transform duration-300">
                  <div className="text-emerald-300 text-sm font-medium mb-2">🏆 Winner</div>
                  <div className="text-center">
                    {!finished1 && !finished2 ? (
                      <div>
                        <div className="text-white text-sm font-bold">Racing...</div>
                        <div className="text-xs text-gray-400 mt-1">Algorithms competing</div>
                      </div>
                    ) : !finished1 || !finished2 ? (
                      <div>
                        <div className="text-yellow-400 text-sm font-bold">In Progress</div>
                        <div className="text-xs text-gray-400 mt-1">Waiting for both to finish</div>
                      </div>
                    ) : operations1 < operations2 ? (
                      <div>
                        <div className="text-xl font-bold text-emerald-400">{algorithms[selectedAlgorithm].name}</div>
                        <div className="text-xs text-emerald-300 mt-1">
                          {operations2 > 0 ? `${Math.round(((operations2 - operations1) / operations2) * 100)}% fewer ops` : 'Finished first'}
                        </div>
                        <div className="text-xs text-emerald-300">{Math.abs((time2 - time1) / 1000).toFixed(2)}s faster</div>
                      </div>
                    ) : operations2 < operations1 ? (
                      <div>
                        <div className="text-xl font-bold text-emerald-400">{algorithms[compareAlgorithm].name}</div>
                        <div className="text-xs text-emerald-300 mt-1">
                          {operations1 > 0 ? `${Math.round(((operations1 - operations2) / operations1) * 100)}% fewer ops` : 'Finished first'}
                        </div>
                        <div className="text-xs text-emerald-300">{Math.abs((time1 - time2) / 1000).toFixed(2)}s faster</div>
                      </div>
                    ) : (
                      <div>
                        <div className="text-xl font-bold text-yellow-400">It's a Tie!</div>
                        <div className="text-xs text-gray-400 mt-1">Same operations & time</div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-blue-500/10 border border-blue-400/30 rounded-xl p-3 hover:scale-105 transition-transform duration-300">
                  <div className="text-blue-300 text-sm font-medium mb-2">⚡ Efficiency</div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-blue-200">{algorithms[selectedAlgorithm].name}:</span>
                      <span className="text-white font-bold">{algorithms[selectedAlgorithm].complexity.time}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-blue-200">{algorithms[compareAlgorithm].name}:</span>
                      <span className="text-white font-bold">{algorithms[compareAlgorithm].complexity.time}</span>
                    </div>
                    {algorithms[selectedAlgorithm].complexity.time !== algorithms[compareAlgorithm].complexity.time && (
                      <div className="mt-2 pt-2 border-t border-blue-400/30">
                        <span className="text-yellow-300 text-[10px]">
                          💡 {algorithms[selectedAlgorithm].complexity.time === 'O(log n)' || algorithms[compareAlgorithm].complexity.time === 'O(log n)' 
                            ? 'Log complexity scales incredibly well!' 
                            : 'Different complexities show real performance gaps'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="bg-gradient-to-br from-white/10 to-cyan-500/10 backdrop-blur-xl rounded-2xl p-4 mt-3 border border-cyan-400/30 shadow-xl shadow-cyan-500/10">
          <h3 className="text-base font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-white mb-3">
            Understanding the Visualization
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
            <div className="flex items-center gap-3 bg-cyan-500/10 p-3 rounded-xl border border-cyan-400/30 hover:scale-105 transition-transform duration-300">
              <div className="w-8 h-8 bg-gradient-to-t from-cyan-500 to-blue-500 rounded flex-shrink-0"></div>
              <div>
                <div className="text-white text-sm font-bold">Unsorted</div>
                <div className="text-cyan-300 text-xs">Not yet processed</div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-yellow-500/10 p-3 rounded-xl border border-yellow-400/30 hover:scale-105 transition-transform duration-300">
              <div className="w-8 h-8 bg-gradient-to-t from-yellow-500 to-amber-500 rounded animate-pulse flex-shrink-0"></div>
              <div>
                <div className="text-white text-sm font-bold">Comparing</div>
                <div className="text-yellow-300 text-xs">Being compared</div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-red-500/10 p-3 rounded-xl border border-red-400/30 hover:scale-105 transition-transform duration-300">
              <div className="w-8 h-8 bg-gradient-to-t from-red-500 to-orange-500 rounded animate-bounce flex-shrink-0"></div>
              <div>
                <div className="text-white text-sm font-bold">Swapping</div>
                <div className="text-red-300 text-xs">Positions swapping</div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-emerald-500/10 p-3 rounded-xl border border-emerald-400/30 hover:scale-105 transition-transform duration-300">
              <div className="w-8 h-8 bg-gradient-to-t from-emerald-500 to-teal-500 rounded flex-shrink-0"></div>
              <div>
                <div className="text-white text-sm font-bold">Sorted</div>
                <div className="text-emerald-300 text-xs">In final position</div>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/50 rounded-xl p-3">
            <h4 className="text-cyan-300 font-bold mb-2 text-sm flex items-center gap-2">
              <TrendingUp size={16} />
              Pro Tips
            </h4>
            <div className="grid md:grid-cols-2 gap-3 text-xs text-cyan-100">
              <div className="flex gap-2">
                <span className="text-cyan-400">💡</span>
                <span><strong>Compare Mode:</strong> See algorithms race side-by-side with same input</span>
              </div>
              <div className="flex gap-2">
                <span className="text-cyan-400">⚡</span>
                <span><strong>Operations:</strong> Lower count = more efficient algorithm</span>
              </div>
              <div className="flex gap-2">
                <span className="text-cyan-400">📊</span>
                <span><strong>Array Size:</strong> Increase size to see complexity differences amplify</span>
              </div>
              <div className="flex gap-2">
                <span className="text-cyan-400">🎯</span>
                <span><strong>Big O:</strong> Theoretical complexity - watch it play out visually!</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlgorithmComplexityVisualizer;
